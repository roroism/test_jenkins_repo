import React from 'react';
import { useState, useEffect } from 'react';
import { downloadData, downloadMedia, getData, saveData } from './IndexedDb';

export const Image2 = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [newSrc, setNewSrc] = useState('');
  var child;
  useEffect(() => {
    const init = async () => {
      let temp = await getData(props.dbName, props.tableName, props.src).then(async (resp: any) => {
        if (resp === 'fail') {
          setNewSrc(props.src);
          let image = await downloadMedia(props.src).then(async (resp: any) => {
            saveData(props.dbName, props.tableName, { url: props.src, image: resp });
          });
        } else if (typeof resp === 'object' && !Array.isArray(resp) && resp !== null) {
          let objectURL = URL.createObjectURL(resp.image);
          setNewSrc(objectURL);
        }

        setLoaded(true);
      });
    };
    init();
  }, []);

  if (loaded) {
    if (!props.children)
      return (
        <img
          src={newSrc}
          style={props.style ? props.style : {}}
          className={props.className ? props.className : ''}
        />
      );
    else return React.cloneElement(props.children, { src: newSrc });
  } else return 'Loading';
};
