import { useContext, useState } from 'react';
import './stories.scss';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';

const Stories = () => {
  const [file, setFile] = useState(null);
  console.log(file);
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(['stories'], () =>
    makeRequest.get('/stories').then(res => {
      return res.data;
    })
  );

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await makeRequest.post('/upload', formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    newStory => {
      return makeRequest.post('/stories', newStory);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stories']);
      },
    }
  );

  const handleAdd = async e => {
    e.preventDefault();
    if (!file) return;
    let imgUrl = '';
    if (file) imgUrl = await upload();
    mutation.mutate({ img: imgUrl });
    setFile(null);
  };
  return (
    <div className="stories">
      <div className="story">
        {file && (
          <img className="file" alt="" src={URL.createObjectURL(file)} />
        )}
        <input
          type="file"
          id="storyFile"
          style={{ display: 'none' }}
          onChange={e => setFile(e.target.files[0])}
        />
        <label htmlFor="storyFile">
          <img src={'/upload/' + currentUser.profilePic} alt="" />
        </label>
        <span>{currentUser.name}</span>
        <button onClick={handleAdd}>+</button>
      </div>
      {error
        ? 'Something went wrong'
        : isLoading
        ? 'loading'
        : data.map(story => (
            <div className="story" key={story.id}>
              <img src={'/upload/' + story.img} alt="" />
            </div>
          ))}
    </div>
  );
};

export default Stories;
