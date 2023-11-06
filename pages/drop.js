import { DropDown, DropDownContainer, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from "@/lib/Pop-Cards/DropDown";

export default function Drop() {
    return (
        <>
            <DropDownContainer>
                <DropDownTrigger>
                    <button>Open</button>
                </DropDownTrigger>
                <DropDown>
                    <DropDownSectionTitle>Test</DropDownSectionTitle>
                    <DropDownSection>
                        <DropDownItem>

                            Abc
                        </DropDownItem>
                    </DropDownSection>
                </DropDown>
            </DropDownContainer>
        </>
    )
}