import Link from 'next/link';

export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' }
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return <li key={label} className="nav-item me-2">
                <Link className="nav-link" href={href}>{label}</Link>
            </li>
        })


    return <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
        <Link href="/">
            <a className="navbar-brand" href="/">GitTix</a>
        </Link>
        <div className="d-flex justify-content-end">
            <ul className="nav d-flex">
                {links}
            </ul>
        </div>
        </div>
    </nav>

}