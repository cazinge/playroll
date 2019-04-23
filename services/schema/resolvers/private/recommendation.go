package private

import (
	"fmt"

	"github.com/cazinge/playroll/services/gqltag"
	"github.com/cazinge/playroll/services/models"
	"github.com/cazinge/playroll/services/models/jsonmodels"
	"github.com/cazinge/playroll/services/utils"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

// RecommendationMethods defines the methods for the Recommendations entity.
type RecommendationMethods struct {
	ListCurrentUserRecommendations *gqltag.Query    `gql:"listCurrentUserRecommendations(offset: Int, count: Int): [Recommendation]"`
	CreateRecommendation           *gqltag.Mutation `gql:"createRecommendation(input: RecommendationInput): Recommendation"`
	DismissRecommendation          *gqltag.Mutation `gql:"dismissRecommendation(recommendationID: ID): Recommendation"`
	RecommendToAUser               *gqltag.Mutation `gql:"recommendToAUser(receiverID: Int, playrollID: Int, rollData: RollDataInput): Recommendation"`
}

var listCurrentUserRecommendations = gqltag.Method{
	Description: `This function lists the current user's recommendations.`,
	Request: func(resolveParams graphql.ResolveParams, mctx *gqltag.MethodContext) (interface{}, error) {
		user, err := models.AuthorizeUser(mctx)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		type listCurrentUserRecommendationsParams struct {
			Offset uint
			Count  uint
		}
		params := &listCurrentUserRecommendationsParams{}
		err = mapstructure.Decode(resolveParams.Args, params)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		recommendationsModels := &[]models.Recommendation{}
		db := mctx.DB
		if err := db.Preload("Recommender").Where(models.Recommendation{UserID: user.ID, IsActive: true}).Find(recommendationsModels).Error; err != nil {
			fmt.Printf("error getting recommendations: %s", err.Error())
			return nil, err
		}

		recommendations, err := models.FormatRecommendationSlice(recommendationsModels)
		if err != nil {
			return nil, err
		}
		return recommendations, nil
	},
}

var createRecommendation = gqltag.Method{
	Description: `Dismisses the current user's recommendation.`,
	Request: func(resolveParams graphql.ResolveParams, mctx *gqltag.MethodContext) (interface{}, error) {
		user, err := models.AuthorizeUser(mctx)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		e := &models.Recommendation{}
		dao := e.InitDAO(mctx.DB)

		type createEntityParams struct {
			Input models.RecommendationInput
		}
		params := &createEntityParams{}
		err = mapstructure.Decode(resolveParams.Args, params)
		fmt.Printf("%#v\n", params)
		fmt.Printf("%#v\n", params.Input)

		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		entity, err := params.Input.ToModel()
		if err != nil {
			return nil, err
		}

		rawEntity, err := dao.Create(entity)
		if err != nil {
			return nil, err
		}

		userID := utils.StringIDToNumber(params.Input.UserID)

		recommendationName := "."

		if len(params.Input.Data.Sources) > 0 {
			mainSource := params.Input.Data.Sources[0]
			if mainSource.Type == "Artist" {
				recommendationName = fmt.Sprintf(": %s", mainSource.Name)
			} else {
				recommendationName = fmt.Sprintf(": %s by %s", mainSource.Name, mainSource.Creator)
			}
		}

		pushNotification := &models.PushNotification{
			Type:  "RECEIVED_RECOMMENDATION",
			Title: "Received Recommendation",
			Body:  fmt.Sprintf("%s has just sent you a recommendation%s", user.Name, recommendationName),
		}

		if err := models.SendUserPushNotification(userID, pushNotification, mctx.DB); err != nil {
			return nil, err
		}

		return dao.Format(rawEntity)
	},
}

var dismissRecommendation = gqltag.Method{
	Description: `Dismisses the current user's recommendation.`,
	Request: func(resolveParams graphql.ResolveParams, mctx *gqltag.MethodContext) (interface{}, error) {
		user, err := models.AuthorizeUser(mctx)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		type dismissRecommendationParams struct {
			RecommendationID string
		}
		params := &dismissRecommendationParams{}
		err = mapstructure.Decode(resolveParams.Args, params)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		recommendationID := utils.StringIDToNumber(params.RecommendationID)

		recommendationModel := &models.Recommendation{}
		if err := mctx.DB.Where(&models.Recommendation{UserID: user.ID}).First(recommendationModel, recommendationID).Error; err != nil {
			return nil, err
		}

		recommendationModel.IsActive = false
		if err := mctx.DB.Save(recommendationModel).Error; err != nil {
			fmt.Println(err)
			return nil, err
		}

		return models.FormatRecommendation(recommendationModel)
	},
}

var recommendToAUser = gqltag.Method{
	Description: `Recommends the selected Playroll to a user.`,
	Request: func(resolveParams graphql.ResolveParams, mctx *gqltag.MethodContext) (interface{}, error) {
		user, err := models.AuthorizeUser(mctx)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		type recommendToAUserParams struct {
			ReceiverID    uint
			PlayrollID    uint
			RollDataInput jsonmodels.RollDataInput
		}

		params := &recommendToAUserParams{}
		err = mapstructure.Decode(resolveParams.Args, params)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		relationship := &models.Relationship{}
		db := mctx.DB
		err = db.Where(&models.Relationship{UserID: params.ReceiverID, OtherUserID: user.ID, IsBlocking: false, Status: "Friend"}).First(relationship).Error
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		rollData, err := params.RollDataInput.ToModel()
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		recommendation := models.Recommendation{Data: *rollData, UserID: params.ReceiverID, RecommenderID: user.ID, PlayrollID: params.PlayrollID}
		db.Create(&recommendation)

		return recommendation, nil
	},
}

// LinkedRecommendationMethods exports the methods for the Recommendations entity.
var LinkedRecommendationMethods = RecommendationMethods{
	ListCurrentUserRecommendations: gqltag.LinkQuery(listCurrentUserRecommendations),
	CreateRecommendation:           gqltag.LinkMutation(createRecommendation),
	DismissRecommendation:          gqltag.LinkMutation(dismissRecommendation),
	RecommendToAUser:               gqltag.LinkMutation(recommendToAUser),
}
