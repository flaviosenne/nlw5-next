import { GetStaticProps} from 'next'
import { api } from '../services/api'
import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { converDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from './home.module.scss'
import Image from 'next/image'

type Episodes = {
  id: string
  title: string
  members: string
  publushedAt: string
  description: string
  thumbnail: string
  duration: number
  durationAsString: string
  url: string
}
type HomeProps = {
  latestEpisodes: Episodes[]
  allEpisodes: Episodes[]
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return(
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodesDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publushedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódios"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <th></th>
              <th>Titulo</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </thead>
            <tbody>
              {allEpisodes.map(episode => {
                return(
                  <tr key ={episode.id}>
                    <td>
                      <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"/>
                    </td>
                    <td>
                      <a href="">{episode.title}</a>
                    </td>
                    <td>{episode.title} </td>
                    <td>{episode.members} </td>
                    <td>{episode.publushedAt} </td>
                    <td>{episode.durationAsString} </td>
                    <td><button type="button">
                      <img src="/play-green.svg" alt="Tocar episódios"/>
                      </button> </td>
                  </tr>

                )
              })}
            </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async() =>{
  const {data} = await api.get('episodes',{
    params:{
      _limit:12,
      _sort:'published_at',
      _order:'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: converDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      allEpisodes,
      latestEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}