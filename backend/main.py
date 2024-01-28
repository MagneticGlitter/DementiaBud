from flask import Flask, jsonify, render_template, Response, request
import tensorflow as tf
import numpy as np
import cv2
from keras.models import load_model
import numpy as np
import cohere
from cohere.responses.classify import Example
import requests


app = Flask(__name__)

facedetect = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

cap = cv2.VideoCapture(0)
cap.set(3, 640)
cap.set(4, 480)
font = cv2.FONT_HERSHEY_COMPLEX

model = load_model('keras_model.h5')


def get_className(classNo):
    if classNo == 0:
        return "Caesar"
    elif classNo == 1:
        return "Marshal"
    elif classNo == 2:
        return "Uzair"
    elif classNo == 3:
        return "Rajab"


def face_detect():
    while True:
        sucess, imgOrignal = cap.read()
        faces = facedetect.detectMultiScale(imgOrignal, 1.6, 7)
        for x, y, w, h in faces:
            crop_img = imgOrignal[y:y+h, x:x+h]
            img = cv2.resize(crop_img, (224, 224))
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = img.reshape(1, 224, 224, 3)
            prediction = model.predict(img)
            print("Raw predictions:", prediction)
            classIndex = np.argmax(prediction, axis=-1)
            print("Class index:", classIndex)
            probabilityValue = np.amax(prediction)
            if classIndex == 0 or classIndex == 1 or classIndex == 2 or classIndex == 3:
                cv2.rectangle(imgOrignal, (x, y), (x+w, y+h), (0, 255, 0), 2)
                cv2.rectangle(imgOrignal, (x, y-40), (x+w, y), (0, 255, 0), -2)
                cv2.putText(imgOrignal, get_className(classIndex), (x, y-10), font,
                            0.75, (255, 255, 255), 1, cv2.LINE_AA)

            cv2.putText(imgOrignal, str(round(probabilityValue*100, 2)) +
                        "%", (180, 75), font, 0.75, (255, 0, 0), 2, cv2.LINE_AA)
        ret, buffer = cv2.imencode('.jpg', imgOrignal)
        # k=cv2.waitKey(1)
        # if k==ord('q'):
        # 	break
        imgOrignal = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + imgOrignal + b'\r\n')


def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

SUPABASE_URL = "https://fjnlnhzvvoirzuuiowoh.supabase.co/"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbmxuaHp2dm9pcnp1dWlvd29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzNzUzMDgsImV4cCI6MjAyMTk1MTMwOH0.JwrXdA7OFkR-LFBFve6-wIa6gIKCJMxVo8dOwFxd68Q"
SUPABASE_BUCKET_NAME = "memories"

@app.route('/')
def index():
    return render_template('index_voice_commands.html')

@app.route('/upload_video', methods=['POST'])
def upload_video():
    video_data = request.files['video']
    
    url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET_NAME}/videos/{video_data.filename}"
    headers = {
        "Content-Type": "video/mp4",  
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    }

    with requests.post(url, headers=headers, files={'file': video_data}) as response:
        if response.status_code == 200:
            video_url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET_NAME}/videos/{video_data.filename}"
            return jsonify({'video_url': video_url})
        else:
            return jsonify({'success': False, 'message': f'Failed to upload video. Status Code: {response.status_code}'})



@app.route('/save_transcriptions', methods=['POST'])
def save_transcriptions():
    data = request.json
    transcriptions = data.get('transcriptions')
    transcriptions_string = '\n'.join(transcriptions)
    co = cohere.Client('5ZCwzEUBljEC37UbIpFLgCXtGpMW8XiXYtCiHVX8')
    examples=[Example("Remember when we went to the park? Yeah! The one with the big slide and swings? That's the one. We chatted about school and your friends. I told you about my funny teacher and my best friend, Sarah. Your stories always make me smile. And you said I'm the best storyteller ever! You are, indeed. Our talks make my day. Mine too, especially when we share ice cream after.  Here's it's summary: In this sweet chat, you and your child reminisce about a fun park day, sharing laughter, stories, and the joy of post-play ice cream. It's a heartwarming snapshot of your close bond.", "family"), Example("Hey, remember that crazy exam week? Late-night study sessions were practically our second home! But hey, we nailed it! That feeling when the grades came in was priceless. I called you right away, and we celebrated like there was no tomorrow.",
                        "education"), Example("That date night under the stars was incredible. Seriously, it felt like a scene from a movie. I still remember how we couldn't stop laughing. Best night ever. Agreed. We need more of those magical moments.", "romance"), Example("That game day was insane! I couldn't sit still. Your winning play was legendary. Nachos and victory talks afterward were the perfect way to end it. Let's catch another game soon!", "sports"), Example("Hitting that goal was a journey. The late nights, the hard work—it all paid off. I'll never forget the day it happened. We celebrated like champs. Your success is well-deserved. Cheers to more milestones!", "accomplishment"), Example("Our impromptu family picnic was a blast. Despite the squished sandwiches, we laughed non-stop. Your little sister's fascination with funny-shaped clouds made it even more memorable.", "family"),
    Example("Late-night study sessions during exam week felt like our second home. The relief and joy upon receiving the grades were priceless. We celebrated like there was no tomorrow.", "education"),
    Example("Our date night under the stars was magical. It felt straight out of a movie scene, and we couldn't stop laughing. Best night ever. Let's create more of those enchanting moments together.", "romance"),
    Example("Game day was insane! I couldn't sit still, and your winning play was legendary. Nachos and victory talks afterward were the perfect way to end it. Looking forward to catching another game soon!", "sports"),
    Example("Hitting that goal was a journey of late nights and hard work. The celebration was epic, and your success is well-deserved. Cheers to more milestones and triumphs!", "accomplishment")]
    label = co.classify(inputs=[transcriptions_string], examples=examples)
    summary = co.generate(
        prompt="""I want you to give me a personalized description of the memory text of my life. For example, Here's a conversation: Remember when we went to the park? Yeah! The one with the big slide and swings? That's the one. We chatted about school and your friends. I told you about my funny teacher and my best friend, Sarah. Your stories always make me smile. And you said I'm the best storyteller ever! You are, indeed. Our talks make my day. Mine too, especially when we share ice cream after.  Here's it's summary: In this sweet chat, you and your child reminisce about a fun park day, sharing laughter, stories, and the joy of post-play ice cream. It's a heartwarming snapshot of your close bond.    The following is the memory text of my life:  """ + transcriptions_string)
    print("Received transcriptions:", transcriptions_string)
    return jsonify({label: label, summary: summary})


@app.route('/video_feed')
def video_feed():
    return Response(face_detect(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.after_request(add_cors_headers)
    app.run(port=4000, debug=True)
