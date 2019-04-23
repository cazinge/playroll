package main

import (
	"fmt"
	"os"
	"github.com/cazinge/playroll/services/models"
	"github.com/jinzhu/gorm"
	"github.com/oliveroneill/exponent-server-sdk-golang/sdk"
)

func main() {
	host := fmt.Sprintf(
		"host=%v port=%v user=%v dbname=%v sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_NAME"),
	)

	db, err := gorm.Open("postgres", host)
	if err != nil {
		fmt.Println("error opening db: " + err.Error())
	}
	fmt.Println("Connected to DB!")

	defer db.Close()

	if db.AutoMigrate(models.ModelList...).Error != nil {
		fmt.Println("error migrating db: " + err.Error())
	}

	pushToken, err := expo.NewExponentPushToken("ExponentPushToken[xpkIFyHiKF6zKBX8NO3ysQ]")
	if err != nil {
		panic(err)
	}

	// Create a new Expo SDK client
	client := expo.NewPushClient(nil)

	// Publish message
	response, err := client.Publish(
		&expo.PushMessage{
			To:       pushToken,
			Body:     "This is a test notification",
			Data:     map[string]string{"withSome": "data"},
			Sound:    "default",
			Title:    "Notification Title",
			Priority: expo.DefaultPriority,
		},
	)
	// Check errors
	if err != nil {
		panic(err)
		// return
	}
	// Validate responses
	if response.ValidateResponse() != nil {
		fmt.Println(response.PushMessage.To, "failed")
	}

}

	recommendRollToFriend(db, 1, 2, 123)
}

func recommendRollToFriend(db *gorm.DB, recommenderID uint, userID uint, playrollID uint) (*models.RecommendationOutput, error) {
	recommendations := &[]models.Recommendation{}
	err := db.Find(recommendations).Error
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	// for _, rec := range *recommendations {
	// 	fmt.Println(rec)
	// }

	users := &[]models.User{}
	// err = db.Find(users).Error
	err = db.Offset(3).Limit(3).Find(users).Error
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	for _, u := range *users {
		fmt.Println(u)
	}

	relationship := &models.Relationship{}
	err = db.Where(&models.Relationship{UserID: recommenderID, OtherUserID: userID}).First(relationship).Error
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	if relationship.IsBlocking == true {
		err = errors.New("User is blocked by other user")
		fmt.Println(err)
		return nil, err
	}
	if relationship.Status != "Friend" {
		err = errors.New("User is not friends with other user")
		fmt.Println(err)
		return nil, err
	}
	fmt.Println(relationship)
	fmt.Println("========================")

	strUserID := strconv.Itoa(int(userID))
	strRecommenderID := strconv.Itoa(int(recommenderID))
	strPlayrollID := strconv.Itoa(int(playrollID))
	// roll := models.GetCurrentUserRoll(strUserID)
	recommendationInput := models.RecommendationInput{IsActive: true, UserID: strUserID, RecommenderID: strRecommenderID, PlayrollID: strPlayrollID}
	recommendation, err := models.RecommendationInputToModel(&recommendationInput)
	fmt.Println(recommendation)

	// relationship.OtherUser.Recommendations = append(relationship.OtherUser.Recommendations, &recommendation)

	// Create RollInput
	// Create RecommendationInput from with IsActive, Data, UserID, RecommenderID, PlayrollID
	// recommendationInput := models.RecommendationInput{UserID}

	return nil, nil
}
