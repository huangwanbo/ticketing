import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request'
export default () => {
    const [email, SetEmail] = useState('');
    const [password, SetPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email,
            password
        },
        onSuccess: () => Router.push('/')
    })
    const onSubmit = async (event) => {
        event.preventDefault();

        await doRequest()

        
    }
    return <form onSubmit={onSubmit}>
        <h1>Sign in</h1>
        <div className="form-group">
            <label>Email Address</label>
            <input type="text" 
                   className="form-control"
                   value={email}
                   onChange={e => SetEmail(e.target.value)}
             />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input type="password" 
                   className="form-control"
                   value={password}
                   onChange={e => SetPassword(e.target.value)}
             />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary" >sign in</button>
    </form>
}