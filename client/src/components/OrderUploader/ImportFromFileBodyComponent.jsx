import React from 'react'

const ImportFromFileBodyComponent = ({ onNewOrdersLoad }) => {
  let fileReader

  const handleFileRead = (e) => {
    const content = fileReader.result
    onNewOrdersLoad(JSON.parse(content))
  }

  const handleFileChosen = (file) => {
    fileReader = new FileReader()
    fileReader.onloadend = handleFileRead
    if (file)
      fileReader.readAsText(file)
  }

  return <div className='upload-orders'>
    <label>Charger les commandes:</label>
    <br />
    <input type='file'
           id='file'
           className='input-file'
           accept='.json'
           onChange={e => handleFileChosen(e.target.files[0])}
    />
  </div>
}

export default ImportFromFileBodyComponent
