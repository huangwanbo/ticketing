import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request'
const NewTicket = () => {
    const [title, SetTitle] = useState('');
    const [price, SetPrice] = useState('');

    const onBlur = () => {
        const value = parseFloat(price);

        if (isNaN(value)) {
            return;
        }

        SetPrice(value.toFixed(2));
    }


    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: (ticket) => Router.push('/'),
    })

    const onSubmit = async (event) => {
        event.preventDefault();

        await doRequest()

        
    }

    return <div>
        <h1>Create a Ticket</h1>
        <form onSubmit={onSubmit}>
        <div className="form-group mt-3">
            <label>Title</label>
            <input type="text" 
                   className="form-control"
                   value={title}
                   onChange={e => SetTitle(e.target.value)}
             />
        </div>
        <div className="form-group mt-3">
            <label>Price</label>
            <input type="number" 
                   className="form-control"
                   value={price}
                   onBlur = {onBlur}
                   onChange={e => SetPrice(e.target.value)}
             />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary mt-3" >Create</button>
    </form>
    </div>
};

export default NewTicket;