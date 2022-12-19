const transformResponseToESSInteractionDetails = ({
    id,
    object,
}) => {
    const essDetails = {
        id,
        // name: object?.`dit:directoryFormsApi:Submission:Data`.nature_of_enquiry,
    }
    console.log("Transform! ", essDetails)
    return essDetails
}

export { transformResponseToESSInteractionDetails }