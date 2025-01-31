// External Imports
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fade, Slide } from "react-awesome-reveal";

// Internal Imports
import CardArtist from "../card";
import Canvas from "../canvas";

function Artists({
  state,
  LoadArtists,
  removeArtist,
  updateArtist,
  playMusic,
  setCurrentPage,
  FIRST_PAGE,
  SECOND_PAGE,
  currentPage,
}) {
  const navigate = useNavigate();

  const handleDeleteArtist = id => {
    removeArtist(id);
  };

  // change this to only move you to the form with info
  // dispatch
  const handleUpdateArtist = id => {
    navigate("/form");
    updateArtist(id);
  };

  useEffect(() => {
    LoadArtists();
  }, []);

  const ArtistList = () => {
    const { artists } = state;
    return (
      artists.length !== 0 &&
      artists.map(artist => {
        const { name, country, song, bio, picture, year, copyright, _id } =
          artist;

        return (
          <div key={_id} className="artists">
            <Fade cascade direction="up" triggerOnce>
              <CardArtist
                name={name}
                song={song}
                picture={picture}
                country={country}
                bio={bio}
                year={year}
                copyright={copyright}
                _id={_id}
                handleDeleteArtist={handleDeleteArtist}
                handleUpdateArtist={handleUpdateArtist}
                playMusic={playMusic}
                FIRST_PAGE={FIRST_PAGE}
                SECOND_PAGE={SECOND_PAGE}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Fade>
          </div>
        );
      })
    );
  };

  return (
    <div className="cardGallery ">
      {state.artists?.length > 0 ? (
        <ArtistList />
      ) : (
        <h1 className="noartists">no artists please add </h1>
      )}
    </div>
  );
}

export default Artists;
