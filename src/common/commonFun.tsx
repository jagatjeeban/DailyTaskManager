//function to get the status background color
export const getStatusBgColor = (status: string) => {
    if(status === 'Yet to Start') return 'orange';
    if(status === 'Pending')      return '#1296B0';
    if(status === 'Completed')    return 'green';
}