# SceneIt

CodePath WEB103 Final Project

Designed and developed by: Alameen Adeku, Axin Li, Helen Tran

🔗 Link to deployed app:

## About

A personal movie tracking and discovery application to be built with React and Node.js.

### Description and Purpose

SceneIt is a full-stack web application designed for film enthusiasts to log, rate, and discover movies. In a world with endless streaming options, SceneIt provides a centralized platform for users to manage their viewing history, build a backlog of films they want to watch, and share their opinions with a community.

### Inspiration

This project is inspired by popular platforms like Goodreads and Letterboxd. The goal was to build a complete application from the ground up, focusing on a clean user interface, a dynamic single-page application (SPA) experience, and a robust backend. It serves as a comprehensive portfolio project demonstrating mastery of full-stack development, from database design (including one-to-one, one-to-many, and many-to-many relationships) to a feature-rich React frontend.

## Tech Stack

Frontend: React, Tailwind

Backend: NodeJS, Express, Postgres, Render.

## Features

### Data, Discovery & Interaction

These are the core features available to all users for browsing and discovering movies on the platform.

- [x] Search Functionality: A site-wide search bar allows users to quickly find any movie in the database by its title.

  - [_gif goes here_](https://imgur.com/a/H7FwwxE)

- Robust Filtering & Sorting: On the main "Browse" page, users can refine their search based by:

  - [x] Filter by Genre: Narrow the list to specific genres (e.g., "Horror," "Sci-Fi," "Comedy").
    - [_gif goes here_](https://imgur.com/a/H7FwwxE)
  - [x] Filter by Release Year: Focus on films from a specific decade or year.
    - [_gif goes here_](https://imgur.com/a/H7FwwxE)
  - [x] Sort by: Organize the entire catalog by "Highest Rated," "Most Popular" (based on how many users have it on their watchlist), or "Newest."
    - [_gif goes here_](https://imgur.com/a/H7FwwxE)

- [x] Dynamic Movie Detail Pages: Each movie has its own dedicated, dynamically-routed page that aggregates all user-generated data.

  - [_gif goes here_](https://imgur.com/a/n32Keb6)

- [x] Average Community Rating: The page displays a prominent average star rating, calculated from all user-submitted ratings on the platform.

  - [_gif goes here_](https://imgur.com/a/n32Keb6)

- [ ] Recent Reviews Feed: A feed shows the most recent reviews for that movie, submitted by other SceneIt users.
  - _gif goes here_

### User Profiles & Personal Tracking

These features are centered around the logged-in user, allowing them to build a personal movie-tracking profile.

- [x] Public User Profiles: Every user has a personal, public profile page that acts as their film-tracking homepage. This page showcases:

  - [_gif goes here_](https://imgur.com/a/Ua4c4va)
  - [x] Personalized Statistics: The profile dashboard displays key stats, such as "Total Movies Watched" and "Favorite Genre" (calculated from their ratings).
    - [_gif goes here_](https://imgur.com/a/Ua4c4va)
  - [ ] Activity Feeds: The profile showcases the user's "Recently Watched" activity, as well as a customizable "Top 5 Favorite Movies" list to share their top picks with the community.
    - _gif goes here_

- [ ] Personal Shelf Management: This is the core of the user profile, allowing users to organize the films they are following which would include:
  - [ ] "Completed" Shelf: The user's main archive of watched films.
  - [ ] Star Ratings: Once a movie is marked as "Completed," users can assign it a personal 1-5 star rating.
  - [ ] Written Reviews: Users can write and save detailed personal reviews for any movie they have completed. This provides a personal log and contributes to the community data.
  - [ ] "Want to Watch" (Watchlist): The user's backlog of movies to watch.
  - [ ] Watchlist Priority: To help organize a large backlog, this shelf features a drag-and-drop interface, allowing users to reorder their watchlist and prioritize what they want to see next.
  - [ ] "Now Watching" Shelf: A special shelf for movies a user is currently watching, making it easy to pick up where they left off.

### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

## Installation Instructions

[instructions go here]
