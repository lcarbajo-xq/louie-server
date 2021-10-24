import { createWriteStream, existsSync, mkdirSync, statSync } from 'fs'
import MM from 'music-metadata'
import ProgressBar from 'progress'
import { AlbumModel } from '../models/album.js'
import { ArtistModel } from '../models/artist.js'

import chokidar from 'chokidar'
import { extname } from 'path'
import { GenreModel } from '../models/genre.js'
import { format } from 'util'
import { TrackModel } from '../models/track.js'
import { ScanModel } from '../models/scan.js'

const library = {
  ext: ['.mp3', '.flac', '.m4a']
}

let timer
let tracks = []
let deleteTracks = []
let size = 0

const { watch: dirWatch } = chokidar

export function capitalize(string) {
  return string
    ? string
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    : string
}

export function _onFileAdded(path, stat) {
  clearTimeout(timer)
  if (library.ext.includes(extname(path))) {
    if (!stat) {
      stat = statSync(path)
    }

    size += stat.size
    tracks.push({ path, stat })
  }

  timer = setTimeout(() => {
    tracks = tracks
      .sort((a, b) => b.stat.ctime - a.stat.ctime)
      .map((file) => file.path)
      .reverse()
    build(tracks)
    tracks = []
  }, 3000)
}

export function _onFileDeleted(path, stat) {
  clearTimeout(timer)
  if (library.ext.includes(extname(path))) {
    deleteTracks.push({ path })
  }

  timer = setTimeout(() => {
    // deleteTracks = deleteTracks
    //   .sort((a, b) => b.stat.ctime - a.stat.ctime)
    //   .map((file) => file.path)
    //   .reverse()
    unbuild(deleteTracks)
    deleteTracks = []
  }, 3000)
}

export function watch(ext = '') {
  if (ext && ext.length > 0) {
    library.ext = ext
  }
  dirWatch(process.env.MUSIC_PATH, {
    persistent: true
    //  alwaysStat: true,
    // ignoreInitial: true,
  })
    .on('add', _onFileAdded)
    .on('unlink', _onFileDeleted)
}

export async function unbuild(files) {
  for (const file of files) {
    try {
      console.log('Starting deleting files')
      if (file.path) {
        const exists = await TrackModel.deleteOne({ path: file.path })
        if (exists.deletedCount !== 0) {
          console.log('Delete file: ', file.path)
        }
      } else {
        const exists = await TrackModel.deleteOne({ path: file })
        if (exists.deletedCount !== 0) {
          console.log('Delete file: ', file)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}

export async function build(files) {
  if (!existsSync(`${process.env.CACHE_PATH}`)) {
    mkdirSync(`${process.env.CACHE_PATH}`)
  }

  if (!existsSync(`${process.env.CACHE_PATH}/album-art`)) {
    mkdirSync(`${process.env.CACHE_PATH}/album-art`)
  }

  if (!existsSync(`${process.env.CACHE_PATH}/transcode`)) {
    mkdirSync(`${process.env.CACHE_PATH}/transcode`)
  }

  const scan = {
    start: new Date(),
    mount: process.env.MUSIC_PATH,
    last_scan: new Date(),
    size
  }

  const bar = new ProgressBar(':bar :current/:total ', {
    index: 0,
    total: files.length
  })

  const logStream = createWriteStream('error_log.txt', { flags: 'a' })

  console.log('Starting to build your music library')

  for (const file of files) {
    bar.tick()
    try {
      const exists = await TrackModel.exists({ path: file })

      if (exists) {
        continue
      }

      const metadata = await MM.parseFile(file)

      if (!metadata || metadata.format.tagTypes?.length === 0) {
        throw new Error('No metadata found')
      }

      const names = metadata.common.artists
        .map((name) => name.split(/[,]+/))
        .reduce((a, b) => [...a, ...b], [])
        .map((name) => name.trim())

      const artists = await Promise.all(
        names.map(async (name) => {
          return await ArtistModel.findOrCreate({
            name,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        })
      )

      const pictures = metadata.common.picture || []

      const albumItem = {
        name: metadata.common.album || '',
        artist: artists[0], // assume first artist is the album artist
        year: metadata.common.year || 1970,
        image: pictures.length > 0 ? pictures[0].data : false,
        tags: [],
        bio: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const album = await AlbumModel.findOrCreate(albumItem)

      // Check if metadata contains genre data
      let genre = null
      if (metadata.common.genre && metadata.common.genre[0]) {
        genre = await GenreModel.findOrCreate(metadata.common.genre[0])
      }

      await TrackModel.findOrCreate({
        name: capitalize(metadata.common.title || ''),
        artists,
        album: album._id,
        artist: names.join(', '),
        genre: genre ? genre._id : undefined,
        number: metadata.common.track.no,
        duration: metadata.format.duration || 0,
        path: file,
        lossless: metadata.format.lossless || false,
        year: metadata.common.year || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } catch (error) {
      console.log(error)
      logStream.write(`${file}\n`)
      logStream.write(`[ERROR]: ${format(error)}\n\n`)
    }
  }
  logStream.end()

  scan.end = new Date()
  scan.seconds = (scan.end.getTime() - scan.start.getTime()) / 1000
  scan.tracks = await TrackModel.countDocuments()
  scan.albums = await AlbumModel.countDocuments()
  scan.artists = await ArtistModel.countDocuments()
  console.log('Done building library')
  console.log(scan)

  return ScanModel.findOneAndUpdate({}, scan, {
    upsert: true,
    new: true
  })
}
