import {RSSFeed, RSSItem} from "../App";
import PodcastItem from "./PodcastItem";
import React, {useState} from "react";


type CurrentPlaying = {
    id: number,
    active: boolean,
    playing: boolean,
    setActive?: React.Dispatch<React.SetStateAction<boolean>> | null,
    setPlaying?: React.Dispatch<React.SetStateAction<boolean>> | null,
    url?: string | null,
}


type PodcastListProps = {
    feed?: RSSFeed,
    className?: string
}


function PodcastList({ feed }: PodcastListProps): JSX.Element {

    const [current, setCurrent] = useState<CurrentPlaying>({
        id: -1,
        active: false,
        playing: false,
    })
    const [audio, setAudio] = useState<HTMLAudioElement>()

    const handleAudioButtons = (
        id: number,
        action: boolean,
        setActive: React.Dispatch<React.SetStateAction<boolean>>,
        setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
        url?: string | null,
    ) => {
        if (id === current.id) {
            if (current.playing !== action) {
                setPlaying(action)
                current.playing = action
                if (action) audio?.play()
                else audio?.pause()
            }
        } else {
            if (current.setPlaying) current.setPlaying(false)
            if (current.setActive) current.setActive(false)
            setActive(true)
            setCurrent({
                id: id,
                active: true,
                playing: action,
                setActive: setActive,
                setPlaying: setPlaying,
                url: url,
            })

            if (audio) audio.pause()
            let a: HTMLAudioElement
            if (url) {
                a = new Audio(url)
                a.play()
                    .then(() => {
                        setPlaying(action)
                    })
                setAudio(a)
            }
        }
    }

    return (
        <div className='mx-auto w-[700px] font-mono'>
            <div className='h-28 text-4xl flex justify-center items-center'>
                <h1 className=''>All Episodes</h1>
            </div>
            {feed ? (
                <div>
                    {feed.items.map((item: RSSItem) => {
                        return (
                            <PodcastItem
                                image={feed.imageUrl}
                                channelName={feed.title}
                                item={item}
                                key={item.id}
                                handleAudioButtons={handleAudioButtons}
                            />
                        )
                    })}
                </div>
            ) : null}
        </div>
    )
}

export default PodcastList
