import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Subscribe(props) {
  
  const variable = { userTo: props.userTo }
  // const subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }
  const subscribedVariable = Object.assign({ userFrom: localStorage.getItem('userId') }, variable);
  const [ SubscribeNumber, setSubscribeNumber ] = useState(0)
  const [ Subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    Axios.post('/api/subscribe/subscribeNumber', variable)
    .then(response => {
      if(response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber)
      } else {
        alert("구독자 수 정보를 불러오지 못했습니다.")
      }
    })

    Axios.post('/api/subscribe/subscribed', subscribedVariable)
    .then(response => {
      if(response.data.success) {
        setSubscribed(response.data.subscribed)
      } else {
        alert("구독자 수 정보를 불러오지 못했습니다.")
      }
    })
  }, [])

  const onSubscribe = () => {
    if(Subscribed) {
      // 이미 구독중
      Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
      .then(response => {
        if(response.data.success) {
          setSubscribeNumber(SubscribeNumber - 1)
          setSubscribed(!Subscribed)
        } else {
          alert("구독취소에 실패했습니다.")
        }
      })
    } else {
      Axios.post('/api/subscribe/subscribe', subscribedVariable)
      .then(response => {
        if(response.data.success) {
          setSubscribeNumber(SubscribeNumber + 1)
          setSubscribed(!Subscribed)
        } else {
          alert("구독에 실패했습니다.")
        }
      })
    }
  }

  return (
    <div>
      <button
        style={{ 
          backgroundColor: `${Subscribed ? '#AAAAAA': '#CC0000'}`,
          color: 'white', padding: '10px 16px',
          fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase' 
        }}
        onClick={onSubscribe}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  )
}

export default Subscribe