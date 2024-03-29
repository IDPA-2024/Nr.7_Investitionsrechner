import LastInvestmentData from "../../MockData/overalData.json"
import TypeDiversity from "../../MockData/TypeDiversity.json"
import {
    Box,
    Select,
    Text
} from "@chakra-ui/react";
import { useState } from "react";
import { MainLineChart } from './MainLineChart';
import { MainInfoSection } from './MainInfoSection';
export function MainScreen() {
    const [dateRange, setDateRange] = useState('last7days');

    return (
        <>
            <Box
                width={'90%'}
                minH={'90vh'}
                backgroundColor={'#edf2f7'}
                ml={"10%"}
                mt={"8vh"}
                borderRadius="30px 0 0 0"
                outline={' 1px solid #e2e8f0'}
                px={10}

            >
                <Text
                    py={10}
                    fontSize={'3xl'}
                    fontWeight={'bold'}
                    color={'#2d3748'}
                >
                    Dashboard
                </Text>
                <MainLineChart LastInvestmentData={LastInvestmentData} />
                <MainInfoSection LastInvestmentData={LastInvestmentData} TypeDiversity={TypeDiversity}/>
            </Box>
        </>
    )
}