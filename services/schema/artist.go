package schema

import (
	"fmt"

	"github.com/cazinge/playroll/services/utils"
	"github.com/graphql-go/graphql"
	"github.com/jinzhu/gorm"
	"github.com/mitchellh/mapstructure"
)

type Artist struct {
	utils.Model `gql:"MODEL"`
	Title       string `gql:"title: String"`
	MusicSource MusicSource `gql:"musicSource: MusicSource" gorm:"type:jsonb;not null"`
}

type ArtistMethods struct {
	GetArtist     *utils.Query    `gql:"artist(id: ID!): Artist"`
	SearchArtists *utils.Query    `gql:"searchArtists: [Artist]"`
	ListArtists   *utils.Query    `gql:"listArtists: [Artist]"`
	CreateArtist  *utils.Mutation `gql:"createArtist(artist: CreateArtistInput!): Artist"`
	UpdateArtist  *utils.Mutation `gql:"updateArtist(artist: UpdateArtistInput!): Artist"`
	DeleteArtist  *utils.Mutation `gql:"deleteArtist(id: ID!): Artist"`
}

func getArtist(params graphql.ResolveParams, db *gorm.DB) (interface{}, error) {
	artist := &Artist{}
	id, ok := params.Args["id"].(string)
	if !ok {
		return nil, handleTypeAssertionError("id")
	}

	if err := db.Where("id = ?", id).First(artist).Error; err != nil {
		fmt.Println("Error getting artist: " + err.Error())
		return nil, err
	}
	return artist, nil
}

func searchArtists(params graphql.ResolveParams, db *gorm.DB) (interface{}, error) {
	return []*Artist{&Artist{}, &Artist{}}, nil
}

func listArtists(params graphql.ResolveParams, db *gorm.DB) (interface{}, error) {
	artists := []*Artist{}
	// currently does not handle offset and count
	if err := db.Find(artists).Error; err != nil {
		fmt.Println("Error listing artists: " + err.Error())
		return nil, err
	}
	return artists, nil
}

type CreateArtistInput struct {
	Title string `gql:"title: String"`
	MusicSource MusicSource `gql:"musicSource: MusicSourceInput" json: musicSource`
}

func createArtist(params graphql.ResolveParams, db *gorm.DB) (interface{}, error) {
	title, ok := params.Args["artist"].(map[string]interface{})["title"].(string)
	if !ok {
		return nil, handleTypeAssertionError("title")
	}

	musicSource, ok := params.Args["artist"].(map[string]interface{})["musicSource"].
		(map[string]interface{})
	if !ok {
		return nil, handleTypeAssertionError("musicSource")
	}

	ms := MusicSource{}
	mapstructure.Decode(musicSource, &ms)

	artist := &Artist{
		Title: title,
		MusicSource: ms,
	}
	if err := db.Create(&artist).Error; err != nil {
		fmt.Println("Error creating artist: " + err.Error())
		return nil, err
	}
	return artist, nil
}

type UpdateArtistInput struct {
	ID    string `gql:"id: ID!"`
	Title string `gql:"title: String"`
	MusicSource MusicSource `gql:"musicSource: MusicSourceInput" json: musicSource`
}

func updateArtist(params graphql.ResolveParams, db *gorm.DB) (interface{}, error) {
	artist := &Artist{}
	id, ok := params.Args["artist"].(map[string]interface{})["id"].(string)
	if !ok {
		return nil, handleTypeAssertionError("id")
	}

	title, ok := params.Args["artist"].(map[string]interface{})["title"].(string)
	if !ok {
		return nil, handleTypeAssertionError("title")
	}

	musicSource, ok := params.Args["artist"].(map[string]interface{})["musicSource"].
		(map[string]interface{})
	if !ok {
		return nil, handleTypeAssertionError("musicSource")
	}

	ms := MusicSource{}
	mapstructure.Decode(musicSource, &ms)

	if err := db.Where("id = ?", id).First(artist).Error; err != nil {
		fmt.Println("getting artist to update: " + err.Error())
		return nil, err
	}

	artist.Title = title
	artist.MusicSource = ms
	if err := db.Save(artist).Error; err != nil {
		fmt.Println("error updating artist: " + err.Error())
		return nil, err
	}
	return artist, nil
}

func deleteArtist(params graphql.ResolveParams, db *gorm.DB) (interface{}, error) {
	artist := &Artist{}
	id, _ := params.Args["id"].(string)
	if err := db.Where("id = ?", id).First(artist).Error; err != nil {
		fmt.Println("Error deleting artist: " + err.Error())
		return nil, err
	}
	db.Delete(&artist)
	return artist, nil
}

var ArtistEntity = &utils.Entity{
	Name:  "Artist",
	Model: &Artist{},
	Methods: &ArtistMethods{
		GetArtist:     &utils.Query{Request: getArtist, Scope: "Public"},
		SearchArtists: &utils.Query{Request: searchArtists, Scope: "Public"},
		ListArtists:   &utils.Query{Request: listArtists, Scope: "Admin"},
		CreateArtist:  &utils.Mutation{Request: createArtist, Scope: "Admin"},
		UpdateArtist:  &utils.Mutation{Request: updateArtist, Scope: "Admin"},
		DeleteArtist:  &utils.Mutation{Request: deleteArtist, Scope: "Admin"},
	},
	Types: &[]*utils.Type{
		&utils.Type{Name: "CreateArtistInput", IsInput: true, Model: &CreateArtistInput{}},
		&utils.Type{Name: "UpdateArtistInput", IsInput: true, Model: &UpdateArtistInput{}},
	},
}
