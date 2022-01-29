import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;
    
    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client')
        }
        return this._client;
    }


    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, {url});

        return new Promise((resolve, reject) => {
            this._client!.on('connect', () =>{
                console.log('Connect to NATS');
                resolve();
            })

            this._client!.on('error', (err) =>{
                console.log('Connect to NATS');
                reject(err);
            })
        })
    }
}

export const natsWrapper = new NatsWrapper();