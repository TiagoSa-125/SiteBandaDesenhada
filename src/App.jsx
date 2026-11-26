import { useState } from 'react'
import Intro from './components/Intro.jsx'
import Reader from './components/Reader.jsx'

export default function App() {
  const [screen, setScreen] = useState('intro') // 'intro' | 'reader'

  return screen === 'intro' ? (
    <Intro onStart={() => setScreen('reader')} />
  ) : (
    <Reader fromIntro onHome={() => setScreen('intro')} />
  )
}
