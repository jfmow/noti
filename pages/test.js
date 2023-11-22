import { TabContent, TabGroup, TabMenu, TabMenuItem, TabsProvider } from "@/lib/Pop-Cards/Tabs";

export default function Test() {
    return (
        <div style={{ color: '#fff' }}>
            <TabsProvider>
                <TabGroup>
                    <TabMenu>
                        <TabMenuItem for="abc">
                            Test
                        </TabMenuItem>
                        <TabMenuItem for="efg">
                            Test 2
                        </TabMenuItem>
                    </TabMenu>
                    <TabContent name="abc">
                        tryftguvyhiu
                    </TabContent>
                    <TabContent name="efg">
                        erfetrferf
                    </TabContent>

                </TabGroup>
            </TabsProvider>

        </div>
    )
}