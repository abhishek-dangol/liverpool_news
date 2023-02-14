import fetch from "isomorphic-unfetch";
import moment from "moment";
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination, PaginationItem } from "@material-ui/lab";

const useStyles = makeStyles({
  root: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "green",
  },
  cardHeader: {
    backgroundColor: "black",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  cardContent: {
    color: "white",
    fontSize: "0.9rem",
    lineHeight: "1.2",
  },
});

const PAGE_SIZE = 6;
const NUM_PAGES = 100;

const Home = ({ articles }) => {
  const [page, setPage] = useState(1);
  const classes = useStyles();

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayedArticles = articles.slice(startIndex, endIndex);

  return (
    <>
      <Head>
        <title>Liverpool FC Headlines - News App</title>
      </Head>
      <h1>Liverpool FC Headlines</h1>
      <Grid container spacing={2}>
        {displayedArticles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.title}>
            <Card style={{ height: "100%", backgroundColor: "#C8102E" }}>
              <CardHeader
                title={article.title}
                subheader={moment(article.publishedAt).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
                className={classes.cardHeader}
              />
              <CardMedia
                image={article.urlToImage}
                style={{ height: 0, paddingTop: "56.25%" }}
              />
              <CardContent style={{ overflow: "hidden" }} className={classes.cardContent}>
                <Typography variant="body2" component="p">
                  {article.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Link
                  href={article.url}
                  target="_blank"
                  rel="noopener"
                  color="primary"
                >
                  Read More
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className={classes.root}>
        <Pagination
          count={NUM_PAGES}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          renderItem={(item) => (
            <PaginationItem
              {...item}
              className={item.page === page ? classes.activeButton : null}
            />
          )}
        />
      </div>
    </>
  );
};



Home.getInitialProps = async () => {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=liverpool%20fc&language=en&sortBy=publishedAt&pageSize=100&apiKey=${process.env.NEXT_API_KEY}`
  );
  const data = await res.json();

  return {
    articles: data.articles.filter(
      (article) =>
        article.title.toLowerCase().includes("liverpool") ||
        article.description.toLowerCase().includes("liverpool")
    ),
  };
};


export default Home;
