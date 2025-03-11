// import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,

    Stepper,
    Step,
    List,
    ListItem,
    ListItemPrefix
} from "@material-tailwind/react";
import React, {useState} from "react";

const RedeemAccordion = ({ redeemSteps, terms }) => {
    const [openRedeem, setOpenRedeem] = useState(false);
    const [openTerms, setOpenTerms] = useState(false);
    return (
        <div>
            {redeemSteps?.length >= 1 && (
                <Accordion open={openRedeem} className="border-none shadow-none">
                <AccordionHeader 
                    onClick={() => setOpenRedeem(!openRedeem)}
                    className="text-lg font-thin text-black flex justify-between items-center">
                    Redemption Process 
                    <span className="ml-auto ">
                    ⌄
                    </span>
                </AccordionHeader>
                <AccordionBody>
                    <Stepper orientation="vertical" className="w-full flex flex-col space-y-4 bg-transparent before:hidden after:hidden stepper-container">
                        {redeemSteps?.map((step, index) => (
                            <div key={index} className="relative flex items-start w-full bg-transparent shadow-none">
                                {/* Vertical Connector (Only Show Below Each Step, Except Last One) */}
                                {index !== redeemSteps.length - 1 && (
                                    <div className="absolute left-4 top-10 h-full border-l-2 border-dotted border-[#F15A24]"></div>
                                )}
            
                                {/* Step Number */}
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F15A24] text-white font-bold z-10">
                                    {index + 1}
                                </div>
            
                                {/* Step Text (Aligned Left) */}
                                <p className="ml-6 text-gray-700 flex-1 text-left">{step}</p>
                            </div>
                        ))}
                    </Stepper>
                </AccordionBody>
            </Accordion>
            )}
            {terms?.length >= 1 && (
                <Accordion open={openTerms} className="border-none shadow-none">
                    <AccordionHeader
                    onClick={() => setOpenTerms(!openTerms)}
                    color="red"
                    className="text-lg font-thin text-black flex justify-between items-center">
                        Terms and Conditions 
                        <span className="ml-auto ">
                        ⌄
                        </span>
                        {/* <ChevronDownIcon className="h-5 w-5 text-gray-600" /> */}
                    </AccordionHeader>
                    <AccordionBody>
                        <List className="list-decimal pl-6 text-gray-700 space-y-2">
                            {terms?.map((term, index) => (
                                <ListItem key={index} className="pl-2">
                                    <ListItemPrefix className="text-gray-600">{index + 1}.</ListItemPrefix> {term}
                                </ListItem>
                            ))}
                        </List>
                    </AccordionBody>
                </Accordion>
            )}
        </div>
    );
};
export default RedeemAccordion