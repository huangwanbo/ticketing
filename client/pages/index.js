import axios from 'axios';
import React, { useState, useEffect } from 'react'

const LandingPage = ({ context,currentUser, client }) => {
    const [ticketList, setTicketList] = useState([]);

    useEffect(() => {
        axios.get('/api/tickets').then(res => {
           setTicketList(res.data)
        })
    }, [])
    const List = (data) => {
        console.log(data);
       return data && data.map(ticket => {
            return (
                <tr key={ticket.id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.price}</td>
                </tr>
            );
        })
    }
    
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                    </tr>
                </thead>
                {List(ticketList)}
            </table>
        </div>
    )
};

LandingPage.getInitialProps = async ({context, client, currentUser}) => {
    // const { data } = await client.get('http://tickets-srv:3000/api/tickets');
    return { context,currentUser, client };
};

export default LandingPage;