function processElevenLabsTranscriptionBySpeakerOnly(transcriptionData) {
  const wordsWithTimestamps = transcriptionData.words;

  const dialogueSegments = [];
  let currentSegment = {
    text: "",
    start: null,
    end: null,
    speaker_id: null,
  };

  for (let i = 0; i < wordsWithTimestamps.length; i++) {
    const wordObj = wordsWithTimestamps[i];
    const wordText = wordObj.text;
    const speakerId = wordObj.speaker_id;
    const start = wordObj.start;
    const end = wordObj.end;
    const type = wordObj.type;

    if (type === "spacing") {
      continue;
    }

    if (currentSegment.text === "" || speakerId !== currentSegment.speaker_id) {
      if (currentSegment.text.trim() !== "") {
        dialogueSegments.push({ ...currentSegment });
      }

      currentSegment.text = wordText;
      currentSegment.start = start;
      currentSegment.end = end;
      currentSegment.speaker_id = speakerId;
    } else {
      if (currentSegment.text.length > 0) {
        currentSegment.text += " ";
      }
      currentSegment.text += wordText;
      currentSegment.end = end;
    }
  }

  if (currentSegment.text.trim() !== "") {
    dialogueSegments.push({ ...currentSegment });
  }

  return dialogueSegments;
}

module.exports = { processElevenLabsTranscriptionBySpeakerOnly };
