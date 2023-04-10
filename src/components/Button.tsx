import classNames from "classnames";

type ButtonProps = {
    text: string
    disabled: boolean,
    onClick?: () => void,
    url?: string | undefined,
    type?: string,
}


const Button = ({disabled = false, type = 'webm', ...rest}: ButtonProps): JSX.Element => {

    const classString: string = classNames('text-2xl border-4 border-black rounded-3xl p-3 font-mono hover:bg-lime-200',
        {
            'bg-[pink] cursor-not-allowed': disabled,
        }
    )

    return (
        <>
            {rest.url ? (
                <a href={rest.url} download={`recording.${type}`}>
                    <button className={classString} onClick={rest.onClick} disabled={disabled}>
                        {rest.text}
                    </button>
                </a>
            ) : (
                <button className={classString} onClick={rest.onClick} disabled={disabled}>
                    {rest.text}
                </button>
            )}
        </>
    )

}

export default Button
