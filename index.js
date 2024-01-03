const classifier= knnClassifier.create()
const webcamElement= document.getElementById("webcam")

let net

async function app(){
    console.log("Loading mobilenet...")

    net = await mobilenet.load()

    console.log("loaded model")

    const webcam = await tf.data.webcam(webcamElement)

    const addExample = async (classId)=>{
        const img = await webcam.capture()

        const activiation = net.infer(img, true)

        classifier.addExample(activiation, classId)

        img.dispose()
    }

    document.getElementById("arike").addEventListener("click", ()=> addExample(0))
    document.getElementById("teddy").addEventListener("click", ()=> addExample(1))
    document.getElementById("lilian").addEventListener("click", ()=> addExample(2))

    while (true) {
        if(classifier.getNumClasses()>0){
            const img = await webcam.capture()
            const activiation = net.infer(img, "conv_preds")
            const result = await classifier.predictClass(activation)
            const classes = ["Arike", "Teddy", "Lilian"] 
            document.getElementById("console").innerText=`
            predition: ${classes[result.label]}\n
            probability: ${result.confidence[result.label]} 
            `

            img.dispose()
        }

        await tf.nextFrame
    }

}

app()