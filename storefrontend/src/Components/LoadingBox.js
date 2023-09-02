import Spinner from  'react-bootstrap/Spinner'
 export default function LoadingBox()
{
    return( 
    //  console.log('Ruk Jao')

    <Spinner animation ="border" role="status">
       <span className="visually-hidden">
       </span>
    </Spinner>
    );
}