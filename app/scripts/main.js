/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BK1pKD4UwBeUO0vj2rkuIRgjWS2xdMucWhnO67EkdRBoXfhUxeM67YZsFyHbaiQm0jaYtRLlKeiIvFbMojRgwro';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker и Push уведомления доступны');

    navigator.serviceWorker.register('sw.js')
        .then(function(swReg) {
            console.log('Service Worker зарегистрирован', swReg);

            swRegistration = swReg;
        })
        .catch(function(error) {
            console.error('Ошибка Service Worker`а', error);
        });
} else {
    console.warn('Push сообщения не поддерживаются');
    pushButton.textContent = 'Push сообщения не поддерживаются';
}

// Инициализация пользовательского интерфейса

function initialiseUI() {
    // Запрос подписки
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                console.log('Пользователь подписан');
            } else {
                console.log('Пользователь не подписан');
            }

            updateBtn();
        });
}

// Обновление кнопки
function updateBtn() {
    if (isSubscribed) {
        pushButton.textContent = 'Отключить Push уведомления';
    } else {
        pushButton.textContent = 'Включить Push уведомления';
    }

    pushButton.disabled = false;
}