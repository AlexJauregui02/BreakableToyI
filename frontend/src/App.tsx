import './App.css'
import { Card, CardHeader, CardTitle, CardDescription } from './components/card'

function App() {

  return (
    <>
      <div className='border-1 border-black flex flex-col items-center justify-center'>
        <Card className='w-1/2 mt-10'>
          hola
        </Card>

        <CardHeader>
          hola
        </CardHeader>

        <CardTitle className='w-1/2'>
          Hola Mundo
        </CardTitle>

        <CardDescription className='w-1/2 border-1 border-black'>
          Esta es una descripción de ejemplo para el componente Card.
        </CardDescription>


      </div>
    </>
  )
}

export default App
