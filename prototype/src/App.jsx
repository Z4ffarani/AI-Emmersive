import { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const broadcasterRef = useRef(null);
  const soundcarRef = useRef(null);
  const backgroundRef = useRef(null);

  const [broadcasterVolume, setBroadcasterVolume] = useState(1);
  const [soundcarVolume, setSoundcarVolume] = useState(1);
  const [backgroundVolume, setBackgroundVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundcarFiles = [
    './src/content/sample-1.flac',
    './src/content/sample-2.flac',
    './src/content/sample-3.flac',
    './src/content/sample-4.flac'
  ];

  const soundcarNames = ['E•Tron', 'Zoomer', 'Viper', 'Gryze'];
  const [currentSoundcarIndex, setCurrentSoundcarIndex] = useState(0);

  const syncAudioWithVideo = () => {
    const videoCurrentTime = videoRef.current.currentTime;

    broadcasterRef.current.currentTime = videoCurrentTime;
    backgroundRef.current.currentTime = videoCurrentTime;
    soundcarRef.current.currentTime = videoCurrentTime;
  };

  const initializeAudio = () => {
    broadcasterRef.current.volume = broadcasterVolume;
    backgroundRef.current.volume = backgroundVolume;
    soundcarRef.current.volume = soundcarVolume;
    
    soundcarRef.current.src = soundcarFiles[currentSoundcarIndex];
    syncAudioWithVideo();
  };

  useEffect(() => {
    if (isPlaying) {
      initializeAudio();
      broadcasterRef.current.play().catch(err => console.error("Erro ao tocar o locutor:", err));
      backgroundRef.current.play().catch(err => console.error("Erro ao tocar o fundo:", err));
      soundcarRef.current.play().catch(err => console.error("Erro ao tocar o som do carro:", err));
    } else {
      broadcasterRef.current.pause();
      backgroundRef.current.pause();
      soundcarRef.current.pause();
    }
  }, [isPlaying, currentSoundcarIndex, broadcasterVolume, backgroundVolume, soundcarVolume]);

  const handleBroadcasterToggle = () => {
    const newVolume = broadcasterVolume === 0 ? 1 : 0;
    setBroadcasterVolume(newVolume);
    broadcasterRef.current.volume = newVolume;
  };

  const handleSoundcarToggle = () => {
    const newVolume = soundcarVolume === 0 ? 1 : 0;
    setSoundcarVolume(newVolume);
    soundcarRef.current.volume = newVolume;
  };

  const handleBackgroundToggle = () => {
    const newVolume = backgroundVolume === 0 ? 1 : 0;
    setBackgroundVolume(newVolume);
    backgroundRef.current.volume = newVolume;
  };

  return (
    <main>
      <div className='principal'>
        <img src="./logo-formula-emmersive.png" alt="Logo" />
        <video
          ref={videoRef}
          controls
          muted
          src="./src/content/video.mp4"
          onPlay={() => {
            setIsPlaying(true);
            syncAudioWithVideo();
          }}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={syncAudioWithVideo}
        />

        <div className='samples'>
          <div className='type-broadcaster'>
            <h1>BROADCASTER</h1>
            <div>
              <button className='button-broadcaster' onClick={handleBroadcasterToggle}>
                {broadcasterVolume > 0 ? 'MUTE' : 'UNMUTE'}
              </button>
            </div>
          </div>

          <div className='type-soundcar'>
            <h1>{soundcarNames[currentSoundcarIndex]}</h1>
            <div>
              <button className='button-soundcar' onClick={() => setCurrentSoundcarIndex((prev) => (prev - 1 + soundcarFiles.length) % soundcarFiles.length)}>
                ◄
              </button>
              <button className='button-soundcar' onClick={() => setCurrentSoundcarIndex((prev) => (prev + 1) % soundcarFiles.length)}>
                ►
              </button>
              <button className='button-soundcar' onClick={handleSoundcarToggle}>
                {soundcarVolume > 0 ? 'MUTE' : 'UNMUTE'}
              </button>
            </div>
          </div>

          <div className='type-background'>
            <h1>BACKGROUND</h1>
            <div>
              <button className='button-background' onClick={handleBackgroundToggle}>
                {backgroundVolume > 0 ? 'MUTE' : 'UNMUTE'}
              </button>
            </div>
          </div>
        </div>

        <audio ref={broadcasterRef} src="./src/content/broadcaster.flac" />
        <audio ref={soundcarRef} />
        <audio ref={backgroundRef} src="./src/content/background.flac" />
      </div>
    </main>
  );
}

export default App;
