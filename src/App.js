import React, { useRef, useEffect } from 'react'
import './App.css'
import '@tensorflow/tfjs'
import * as coco_ssd from '@tensorflow-models/coco-ssd'
import Webcam from 'react-webcam'


function App() {
  let videoRef = useRef()
  let canvasRef = useRef()

  //THIS FUNCTION DETECTS OBJECTS. LINE 26 IS WHERE THE DETECTION IS BEING CALLED. ONCE OBJECT IS DETECTED, CALL IS MADE TO DRAW AROUND THEM 
  let detectFromVideo = async (model) => {   

    let Video = videoRef.current.video
    let Canvas = canvasRef.current

    if (Video.readyState !== 4) {         
      console.log('Webcam loading')
    }

    else {
      Canvas.width = Video.videoWidth
      Canvas.height = Video.videoHeight

      let predictions = await model.detect(Video)

      let ctx = Canvas.getContext('2d')

      generateOutline(predictions,ctx)
    }
  }
  
  //THIS FUNCTION DRAWS THE BOXES WHEN THE MODEL DETECTS OBJECTS AND ALSO LABELS THE TYPE OF OBJECT AND ITS CONFIDENCE SCORE
  let generateOutline = (predictions, ctx) => {
    predictions.forEach(prediction => {
        let x = prediction.bbox[0]
        let y = prediction.bbox[1]
        let width = prediction.bbox[2]
        let height = prediction.bbox[3]
        let objectName = prediction.class

        ctx.strokeStyle = ctx.fillStyle = 'yellow'
        ctx.font = '25px Helvetica'

        ctx.fillText(objectName,x,y)
        ctx.fillText((Math.round(prediction.score*100).toFixed(1)) + '%', x + (width/2), y + height)
        ctx.rect(x,y,width,height)
        ctx.stroke()

    })

  }
  
  //THIS IS WHERE THE CONTINUOUS EXECUTION OF MODEL IS DONE. IT LOADS THE MODEL AND THEN CALLS THE DETECTOR FUNCTION
  let executeModel = async () => {
    let model = await coco_ssd.load()

    setInterval(() => {
      detectFromVideo(model)
    }, 50)
  }
  useEffect(() => {
      executeModel()
  },[])


  return (
    <div className='App'>
      <header className='App-header'>
        <Webcam
          ref={videoRef}
          muted
          style={{
            position: 'absolute',
            width: 1200,
            height: 800,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            width: 800,
            height: 700,
          }}
        />
      </header>
    </div>
  )
}

export default App
