# PAD Combo Calculator

## What is PAD?
Puzzle and Dragons (PAD) is a popular mobile game that combines puzzle solving, monster collection, and RPG mechanics to provide a unique gameplay experience.  Players must solve a puzzle of colored orbs arranged in a 6x5 grid in order to active skills and abilities of a team of six monsters.  Each monster provides unique matching requirements for extremely varied gameplay, like 8+ combos, red/blue/green matches, and matching 5 or more connected orbs.  More details provided at the [official website](https://www.puzzleanddragons.us/).

## Overview
![screenshot](https://raw.githubusercontent.com/naisho/pad/master/demo.png)

## Purpose
PAD Combo Calcaulator is a tool to assist players in performing difficult and tedious calculations required to make strategic decisions in-game.  In certain scenarios, like Ranking Dungeon competitions, it is desirable to make the minimum number of combos needed to clear a floor as fast as possible.  Many mechanics must be overcome, like individual values not exceeding a certain amount, certain color damage are voided, etc.  Some leader skills scale wildy with each number of combos, making manual calculations tedious.  This tool will perform these calculations and sort the data in a format that is easy to consume.

## Usage
- install dependencies with `npm install`
- start dev server with `npm start`
- use [PADHerder](https://www.padherder.com/user/freddie/teams/#1423) to build a team
- provide your team ID to the app.  Team 278440 (team used in the Dragonbound Tournament) is provided by default.
- stats and leader skill will be translated and shown.
- a list of combo sets sorted by combo length, then damage will be shown
