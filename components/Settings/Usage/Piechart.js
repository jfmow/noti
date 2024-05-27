import { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { useSettingsPopoverContext } from '..';
export default function UsagePie() {
    const { pb } = useSettingsPopoverContext()
    const [totalusage, setTotalUsage] = useState(0)
    const [quota, setQuota] = useState(0)
    const [maxuploadsize, setMaxUploadSize] = useState(0)
    useEffect(() => {
        async function getTotalUsage() {
            try {
                pb.collection('user_usage').getOne(pb.authStore.model.id).then(((successRes) => {
                    setTotalUsage(Math.round(successRes.total_size * 0.00000095367432))
                }), ((failedRes) => { }));

                const accountFlags = await pb.collection('user_flags').getFirstListItem(`user="${pb.authStore.model.id}"`);
                setQuota(Math.floor(accountFlags.quota * 0.00000095367432))
                setMaxUploadSize(Math.floor(accountFlags.maxUploadSize * 0.00000095367432))
            } catch {
                // Handle errors if needed
            }
        }
        getTotalUsage()
    }, [])

    return (
        <div className="grid p-1 gap-4">
            <div className="">
                <h3 className="text-sm w-full mb-1">Quota usage</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
                <PieChart
                    style={{ width: '100px', height: '100px' }}
                    data={[
                        { title: 'Used', value: totalusage, color: '#E38627' },
                        { title: 'Unused', value: Math.max(0, quota - totalusage), color: '#C13C37' },
                    ]}
                />
                <div className='grid'>
                    <div>
                        <span className='font-medium'>Used: </span>
                        <span>{totalusage}mb</span>
                    </div>
                    <div>
                        <span className='font-medium'>Quota: </span>
                        <span>{quota}mb</span>
                    </div>
                    <div>
                        <span className='font-medium'>Max upload size: </span>
                        <span>{maxuploadsize}mb</span>
                    </div>
                </div>
            </div>

        </div>
    )
}