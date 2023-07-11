import { NotifactionIcon } from '@components/Icons/Navigation'
import Image from 'next/image'
import { FC, Fragment, useEffect } from 'react'
import { RequestJsonOptions } from 'types/misc'

const Notifications: FC = (props) => {
    useEffect(() => {
        (async () => {
            const res = await fetch('/api/profile/notifications', {
                ...RequestJsonOptions,
                method: 'GET'
            })
            const data = await res.json();
            
        })();

    }, [])
    return (
        <NotifactionIcon/>
    )
}

export default Notifications