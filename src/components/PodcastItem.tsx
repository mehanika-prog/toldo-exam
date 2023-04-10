import {RSSItem} from "../App";
import classNames from "classnames";
import React, {useState} from "react";


type PodcastItemProps = {
    image?: string | null,
    channelName?: string | null
    item?: RSSItem,
    isActive?:  boolean,
    isPlaying?: boolean,
    handleAudioButtons (
        id: number,
        action: boolean,
        setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
        setActive: React.Dispatch<React.SetStateAction<boolean>>,
        url?: string | null,
    ): void
}


function PodcastItem({ item, image, channelName, isActive = false, isPlaying = false, handleAudioButtons }: PodcastItemProps): JSX.Element {

    const [active, setActive] = useState<boolean>(isActive)
    const [playing, setPlaying] = useState<boolean>(isPlaying)

    const itemClassString: string = classNames('flex mt-5 w-full h-full',
        {
            'bg-lime-200': active,
        }
    )

    const playClassString: string = classNames('absolute top-6 left-6',
        {
            'opacity-0 hover:opacity-100': !active,
        }
    )

    return (
        <>
            {item ? (
                <div className={itemClassString}>
                    <div className='h-28 w-28 aspect-square relative'>
                        <img
                            className={playClassString}
                            src={playing ? './pause.png' : './play.png'}
                            alt={playing ? 'Pause' : 'Play'}
                            onClick={() => {
                                handleAudioButtons(
                                item.id,
                                !playing,
                                setActive,
                                setPlaying,
                                item.enclosure.url,
                                )
                            }}
                        />
                        <img className='w-28 h-28' src={image ? image : './vite.svg'} alt={channelName ? channelName : 'Logo'}/>
                    </div>
                    <div className='w-full h-28 border-4 border-l-0 border-black p-5 grow'>
                        <div>{item.title}</div>
                        <p className='text-slate-400'>{channelName}</p>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default PodcastItem
