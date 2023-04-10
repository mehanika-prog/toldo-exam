import AudioRecorder from "./components/AudioRecorder"
import AudioRecorderMP3 from "./components/AudioRecorderMP3"
import PodcastList from "./components/PodcastList"
import {useEffect, useState} from "react"


// RSS Feed types for this task only (not all RSS tags).
export type RSSItem = {
    id: number
    title?: string | null,
    enclosure: {
        url?: string | null,
    }
}

export type RSSFeed = {
    title?: string | null,
    imageUrl?: string | null,
    items: RSSItem[],
}

function App() {

    const [feed, setFeed] = useState<RSSFeed>()

    useEffect(() => {
        getFeed().then(feed => {
            setFeed(feed)
        })
    }, [])

    const getFeed = async (): Promise<RSSFeed> => {
        const feedText: string = await fetch(import.meta.env.VITE_RSS_URL).then(r => r.text())
        const xmlDoc: Document = new DOMParser().parseFromString(feedText, 'text/xml')

        const title = xmlDoc.querySelector('title')?.textContent
        const imageUrl = xmlDoc.querySelector('url')?.textContent
        const items: RSSItem[] = []
        let counter: number = 0
        xmlDoc.querySelectorAll('item').forEach((item: Element) => {
            const attributes = item.querySelector('enclosure')?.attributes
            const rssItem: RSSItem = {
                id: counter,
                title: item.querySelector('title')?.textContent,
                enclosure: {
                    url: attributes?.getNamedItem('url')?.textContent,
                }
            }
            items.push(rssItem)
            counter++
        })

        return {
            title: title,
            imageUrl: imageUrl,
            items: items,
        }
    }

    return (
        <div>
            <PodcastList feed={feed}/>
            {import.meta.env.VITE_RECORD_TYPE === 'webm' ? (
                <AudioRecorder />
            ) : null}
            {import.meta.env.VITE_RECORD_TYPE === 'mp3' ? (
                <AudioRecorderMP3 />
            ) : null}
        </div>
    )
}

export default App
