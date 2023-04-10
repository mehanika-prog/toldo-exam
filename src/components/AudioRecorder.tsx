import {useEffect, useRef, useState} from "react"
import Button from "./Button"


const AudioRecorder = (): JSX.Element => {
    const [render, setRender] = useState<boolean>(false)
    const [permission, setPermission] = useState<boolean>(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [recording, setRecording] =  useState<boolean>(false)
    const [audioChunks, setAudioChunks] = useState<Blob[]>([])
    const [audio, setAudio] = useState<string | undefined>(undefined)

    const mediaRecorder = useRef<MediaRecorder | null>(null)

    const mimeType: string = 'audio/webm'

    useEffect((): void => {
        if ('MediaRecorder' in window) {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            }).then(streamData => {
                setPermission(true)
                setStream(streamData)
            }).catch(() => {
                alert('Permission denied. Try to grant access somewhere.')
            })
        } else { alert('Can\'t access to MediaRecorder API!') }
        setTimeout(() => {
            setRender(true)
        }, 200)
    }, [])

    const startRecording = (): void => {
        if (!stream) return
        setRecording(true)
        setAudio(undefined)
        mediaRecorder.current = new MediaRecorder(stream, {mimeType: mimeType})
        mediaRecorder.current.start()
        let localAudioChunks: Blob[] = []
        mediaRecorder.current.ondataavailable = (event) =>{
            if (typeof event.data === "undefined") return
            if (event.data.size === 0) return
            localAudioChunks.push(event.data)
        }
        setAudioChunks(localAudioChunks)
    }

    const stopRecording = (): void => {
        if (!mediaRecorder.current) return
        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            const audioBlob: Blob = new Blob(audioChunks, {type: mimeType})
            const audioUrl: string = URL.createObjectURL(audioBlob)
            setAudio(audioUrl)
            setAudioChunks([])
        }
        setRecording(false)
    }

    return (
        <div className='fixed left-5 bottom-5 gap-5 flex justify-center min-[1860px]:flex-row flex-col'>
            { render ? (
                !permission ?
                    <Button text={'Start Recording'} disabled={true}/> :
                    !recording ?
                        <>
                            <Button text={'Start Recording'} disabled={false} onClick={startRecording}/>
                            {audio ? <Button text={'Download Recording'} disabled={false} url={audio}/> : null}
                        </> :
                        <Button text={'Stop Recording'} disabled={false} onClick={stopRecording}/>
            ) : null}
        </div>
    )
}

export default AudioRecorder
