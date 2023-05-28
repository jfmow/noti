import style from './Why.module.css'
import Countdown from './countdown';
export default function Why() {
    
    return (
        <div className={style.main}>
            <p>Why are you even here<br />Go away pls</p>
            <Countdown />
        </div>
    )
}