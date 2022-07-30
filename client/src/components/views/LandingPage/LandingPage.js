import React, { useEffect, useState, useRef } from 'react'
import { Typography, Row, Button } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE, POSTER_SIZE } from '../../Config'
import MainImage from './Sections/MainImage'
import Genres from './Sections/Genres'
import GridCard from '../../commons/GridCards'
const { Title } = Typography;
function LandingPage() {
    const buttonRef = useRef(null);

    const [Movies, setMovies] = useState([])
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [CurrentPage, setCurrentPage] = useState(0)
    const [genre, setGenre] = useState()
    const [search, setSearch] = useState("")

    useEffect(() => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&with_genres=${genre}&page=1`;
            fetchMovies(endpoint)
    }, [genre])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])




    const fetchMovies = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                // console.log(result)
                {true ? setMovies([...Movies, ...result.results]) : setMovies([...result.results]) }
                setMainMovieImage(MainMovieImage || result.results[0])
                setCurrentPage(result.page)
            }, setLoading(false))
            .catch(error => console.error('Error:', error)
            )
    }

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        console.log('CurrentPage', CurrentPage)
        endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&with_genres=${genre}&page=${CurrentPage + 1}`;
        fetchMovies(endpoint);
        // setCurrentPage(prevValue => {return prevValue+1})
        

    }

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 1) {

            //  loadMoreItems()
            console.log('clicked')
            buttonRef.current.click();

        }
    }

    function handleChange(id){

        setMovies([])
        console.log(Movies)
        setGenre(id)
        setCurrentPage(1)
    }
    function testSubmit(e){
        e.preventDefault()
        setSearch(e.target.value)
        console.log(search)
        setMovies([])
        fetchMovies('https://api.themoviedb.org/3/search/movie?&api_key=e44ced425e7dfc7a1a94d6958674620d&query='+search)
    }

    return (
        <div style={{ width: '100%', margin: '0' }}>
            {MainMovieImage &&
                <MainImage
                    image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
                    title={MainMovieImage.original_title}
                    text={MainMovieImage.overview}
                />

            }

            <div style={{ width: '85%', margin: '1rem auto' }}>
            {/* <input type="text" onChange={(e) => setSearch(e.target.value)} /> */}
            {/* <form>
                <input type="text" onChange={(e) => setSearch(e.target.value)} />
                <button type="submit" onClick={testSubmit}>Go</button>
            </form> */}
                <Title level={2} > TRENDING </Title>
                <Genres handleChange={handleChange} />
                <br />
                <Row gutter={[16, 16]}>
                    {Movies && Movies.map((movie, index) => (
                        <React.Fragment key={index}>
                            <GridCard
                                image={movie.poster_path ?
                                    `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                    : null}
                                movieId={movie.id}
                                movieName={movie.original_title}
                            />
                        </React.Fragment>
                    ))}
                </Row>

                {Loading &&
                    <div>Loading...</div>}

                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>Load More</button>
                    {/* <button ref={buttonRef} className="loadMore" >Load More</button> */}
                </div>
            </div>

        </div>
    )
}

export default LandingPage

