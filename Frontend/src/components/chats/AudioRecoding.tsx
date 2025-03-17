/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { X, Square, Send } from 'lucide-react';

const AudioRecorder: React.FC<{ handleIsAudio: () => void, handleAudioSend: (audioFile: File, chatId: string) => Promise<boolean>, chatId: string }> = ({ handleIsAudio, handleAudioSend, chatId }) => {
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);


  const MAX_RECORDING_TIME = 60; // 1 minute in seconds

  useEffect(() => {
    startRecording();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Reset state
      audioChunksRef.current = [];
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      setIsAudioLoaded(false);

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Set up timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 0.1; // Update every 100ms
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 100);

    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStopClick = () => {
    stopRecording();
  };

  const handleCancelClick = () => {
    stopRecording();
    handleIsAudio();
  };

  const handleSendClick = async () => {
    if (audioBlob) {
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
        lastModified: new Date().getTime()
      });
      setLoading(true);
      await handleAudioSend(audioFile, chatId);
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center w-full bg-blue-500 rounded-full p-2 text-white">
      <button
        onClick={handleCancelClick}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-blue-500"
      >
        <X size={20} />
      </button>

      <div className="flex-1 mx-4">
        {isRecording ? (
          <div className="flex items-center">
            <button
              onClick={handleStopClick}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-blue-500 mr-3"
            >
              <Square size={14} />
            </button>

            <div className="flex-1 h-2 bg-blue-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{
                  width: `${(recordingTime / MAX_RECORDING_TIME) * 100}%`,
                  transition: 'width 100ms linear'
                }}
              />
            </div>
          </div>
        ) : (
          <audio
            ref={audioRef}
            src={audioUrl || ''}
            controls
            preload='metadata'
            className="w-full h-8"
            onLoadedMetadata={() => setIsAudioLoaded(true)}
          />
        )}
      </div>

      <div className="flex items-center">
        {isRecording && (
          <div className="mr-2 w-10 text-center">
            {formatTime(recordingTime)}
          </div>
        )}
        {!isRecording && isAudioLoaded && (
          <button
            onClick={handleSendClick}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-blue-500"
          >
            {
              loading ? <div className='spinner1'></div> :
                <Send size={20} />
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;