function encodeAudio(audioFile, message, key) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const audioData = e.target.result;
      const context = new (window.AudioContext || window.webkitAudioContext)();
      context.decodeAudioData(audioData, function(buffer) {
        const encodedBuffer = hideMessage(buffer, message, key);
        const encodedAudioData = audioBufferToWav(encodedBuffer);
        const encodedAudioBlob = new Blob([encodedAudioData], {
          type: 'audio/wav',
        });
        resolve(encodedAudioBlob);
      });
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(audioFile);
  });
}
function hideMessage(audioBuffer, message, key) {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const frameCount = audioBuffer.length;
  const keyBytes = stringToBytes(key);
  const messageBytes = stringToBytes(message);
  const totalBytes = messageBytes.length + keyBytes.length;

  const encodedBuffer = new AudioBuffer({
    numberOfChannels: numChannels,
    length: frameCount,
    sampleRate: sampleRate,
  });

  for (let channel = 0; channel < numChannels; channel++) {
    const inputData = audioBuffer.getChannelData(channel);
    const outputData = encodedBuffer.getChannelData(channel);

    for (let i = 0; i < frameCount; i++) {
      outputData[i] = inputData[i];
    }
  }

  let byteIndex = 0;
  const keyLength = keyBytes.length;
  const messageLength = messageBytes.length;

  for (let channel = 0; channel < numChannels; channel++) {
    const outputData = encodedBuffer.getChannelData(channel);

    for (let i = 0; i < frameCount; i++) {
      if (byteIndex < totalBytes) {
        const byte =
          messageBytes[byteIndex % messageLength] ^
          keyBytes[byteIndex % keyLength];
        outputData[i] = hideByteInSample(outputData[i], byte);
        byteIndex++;
      } else {
        break;
      }
    }
  }

  return encodedBuffer;
}

function hideByteInSample(sample, byte) {
  const MAX_AMPLITUDE = 1.0;
  const MIN_AMPLITUDE = -1.0;
  const RANGE = MAX_AMPLITUDE - MIN_AMPLITUDE;
  const amplitudeStep = RANGE / 256;
  const encodedSample = MIN_AMPLITUDE + byte * amplitudeStep;

  if (encodedSample < MIN_AMPLITUDE) {
    return MIN_AMPLITUDE;
  }
  if (encodedSample > MAX_AMPLITUDE) {
    return MAX_AMPLITUDE;
  }

  return encodedSample;
}

const decodeAudio = (audioFile, key) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const audioData = e.target.result;
      const context = new (window.AudioContext || window.webkitAudioContext)();
      context.decodeAudioData(audioData, function(buffer) {
        const decodedMessage = retrieveMessage(buffer, key);
        resolve(decodedMessage);
      });
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(audioFile);
  });
};

function retrieveMessage(audioBuffer, key) {
  const numChannels = audioBuffer.numberOfChannels;
  const frameCount = audioBuffer.length;
  const keyBytes = stringToBytes(key);
  const totalBytes = keyBytes.length;

  let byteIndex = 0;
  const keyLength = keyBytes.length;
  const decodedBytes = [];

  for (let channel = 0; channel < numChannels; channel++) {
    const inputData = audioBuffer.getChannelData(channel);

    for (let i = 0; i < frameCount; i++) {
      if (byteIndex < totalBytes) {
        const byte = retrieveByteFromSample(inputData[i]);
        const decodedByte = byte ^ keyBytes[byteIndex % keyLength];
        decodedBytes.push(decodedByte);
        byteIndex++;
      } else {
        break;
      }
    }
  }

  const decodedMessage = bytesToString(decodedBytes);
  return decodedMessage;
}

function retrieveByteFromSample(sample) {
  const MAX_AMPLITUDE = 1.0;
  const MIN_AMPLITUDE = -1.0;
  const RANGE = MAX_AMPLITUDE - MIN_AMPLITUDE;
  const amplitudeStep = RANGE / 256;
  const byte = Math.round((sample - MIN_AMPLITUDE) / amplitudeStep);

  return byte;
}

function stringToBytes(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

function bytesToString(bytes) {
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return str;
}

function audioBufferToWav(buffer) {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const channelData = [];

  // Copy channel data from the audio buffer
  for (let channel = 0; channel < numberOfChannels; channel++) {
    channelData.push(buffer.getChannelData(channel));
  }

  const interleaved = interleave(channelData);

  const bufferLength = interleaved.length * 2;
  const view = new ArrayBuffer(44 + bufferLength);
  const data = new DataView(view);

  // WAV header
  writeString(data, 0, 'RIFF'); // ChunkID
  data.setUint32(4, 36 + bufferLength, true); // ChunkSize
  writeString(data, 8, 'WAVE'); // Format
  writeString(data, 12, 'fmt '); // Subchunk1ID
  data.setUint32(16, 16, true); // Subchunk1Size
  data.setUint16(20, 1, true); // AudioFormat
  data.setUint16(22, numberOfChannels, true); // NumChannels
  data.setUint32(24, sampleRate, true); // SampleRate
  data.setUint32(28, sampleRate * 2 * numberOfChannels, true); // ByteRate
  data.setUint16(32, numberOfChannels * 2, true); // BlockAlign
  data.setUint16(34, 16, true); // BitsPerSample
  writeString(data, 36, 'data'); // Subchunk2ID
  data.setUint32(40, bufferLength, true); // Subchunk2Size

  // Write interleaved data
  floatTo16BitPCM(data, 44, interleaved);

  return new Uint8Array(view);
}

function interleave(channelData) {
  const numberOfChannels = channelData.length;
  const length = channelData[0].length;
  const result = new Float32Array(length * numberOfChannels);
  let offset = 0;

  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      result[offset] = channelData[channel][i];
      offset++;
    }
  }

  return result;
}

function writeString(dataView, offset, string) {
  for (let i = 0; i < string.length; i++) {
    dataView.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(dataView, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const sample = Math.max(-1, Math.min(1, input[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    dataView.setInt16(offset, intSample, true);
  }
}

module.exports = { decodeAudio, encodeAudio };
