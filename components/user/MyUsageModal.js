import { useEffect, useState } from "react"
import PocketBase from 'pocketbase'
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false);
import Chart from 'chart.js/auto';
import Head from "next/head";
import { ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";


export default function MyUsage({ close }) {
    return (
        <>

            <Head>
                <title>My usage</title>
            </Head>
            <ModalContainer events={close}>
                <ModalForm>
                    <ModalTitle>Usage:</ModalTitle>
                    <MyUsagePie />
                </ModalForm>
            </ModalContainer>
        </>
    )
}

function MyUsagePie() {
    const [usage, SetUsage] = useState(100);
    useEffect(() => {
        async function GetData() {
            let files = {
                "id": pb.authStore.model.id,
                "collectionName": "total_files_per_user",
                "total_size": 0
            }
            let imgs = {
                "id": pb.authStore.model.id,
                "collectionName": "Total_img_per_user",
                "total_size": 0
            }
            try {
                const Imgsrecord = await pb.collection('Total_img_per_user').getOne(pb.authStore.model.id);
                imgs = Imgsrecord
            } catch (err) {
                console.warn(err)
            }
            try {
                const Filesrecord = await pb.collection('total_files_per_user').getOne(pb.authStore.model.id);
                files = Filesrecord
            } catch (err) {
                console.warn(err)
            }
            const combinedResult = (files.total_size + imgs.total_size) / 1000000
            SetUsage(combinedResult)
        }
        GetData()
    }, [])
    useEffect(() => {
        // Create a new Chart instance when `usage` is updated
        createPieChart();
    }, [usage]);

    const createPieChart = () => {
        const storageUsedInMB = usage;
        const storageRemainingInMB = 10 - usage > 0 ? 10 - usage : 0;

        const chartData = {
            labels: ['Storage Used (MB)', 'Storage Remaining (MB)'],
            datasets: [{
                data: [storageUsedInMB, storageRemainingInMB],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            }],
        };

        const chartConfig = {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
            },
        };

        const chartElement = document.getElementById('storageChart');
        if (chartElement) {
            // Ensure the chart is destroyed before re-creating it
            if (chartElement.chart) {
                chartElement.chart.destroy();
            }

            // Create the new chart
            chartElement.chart = new Chart(chartElement, chartConfig);
        }
    };

    return (
        <div>
            <div>
                <canvas id="storageChart" width="400" height="400"></canvas>
            </div>
            <span>Used: {Math.round(usage)}mb | Remaining: {Math.round(10 - usage > 0 ? 10 - usage : 0)}mb</span><br />
            <p>This is <strong>not</strong> page usage this is only for uploaded files, not including covers</p>
        </div>
    );
}