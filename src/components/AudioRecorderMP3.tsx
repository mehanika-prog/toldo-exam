import Button from "./Button";
import {useEffect, useState} from "react";
import {Recorder} from "vmsg";


const recorder: Recorder = new Recorder({
    wasmURL: import.meta.env.VITE_WASM_URL
})

const AudioRecorderMP3 = (): JSX.Element => {
    const [render, setRender] = useState<boolean>(false)
    const [permission, setPermission] = useState<boolean>(false)
    const [recording, setRecording] =  useState<boolean>(false)
    const [audio, setAudio] = useState<string | undefined>(undefined)

    useEffect((): void => {
        if ('MediaRecorder' in window) {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            }).then((): void => {
                setPermission(true)
            }).catch((): void => {
                alert('Permission denied. Try to grant access somewhere.')
            })
        } else { alert('Can\'t access to MediaRecorder API!') }
        setTimeout((): void => {
            setRender(true)
        }, 200)
    }, [])

    const startRecording = (): void => {
        setRecording(true)
        setAudio(undefined)
        recorder.initAudio()
            .then((): void => {
                recorder.initWorker()
                    .then((): void => {
                        recorder.startRecording();
                    })
            })
    }

    const stopRecording = (): void => {
        recorder.stopRecording()
            .then((blob: Blob): void => {
                setAudio(URL.createObjectURL(blob))
                setRecording(false)
            })
    }

    return (
        <div className='fixed left-5 bottom-5 gap-5 flex justify-center min-[1860px]:flex-row flex-col'>
            { render ? (
                !permission ?
                    <Button text='Start Recording' disabled={true}/> :
                    !recording ?
                        <>
                            <Button text='Start Recording' disabled={false} onClick={startRecording}/>
                            {audio ? <Button text='Download Recording' disabled={false} url={audio} type='mp3'/> : null}
                        </> :
                        <Button text='Stop Recording' disabled={false} onClick={stopRecording}/>
            ) : null}
        </div>
    )
}

export default AudioRecorderMP3
