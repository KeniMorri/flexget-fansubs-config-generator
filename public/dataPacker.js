class anime {
    constructor(title = null, season = null, img = null) {
        this.title = title;
        this.season = season;
        this.img = img;
    }

    setVerifiedTitleAndId(verifiedTitle, verifiedId) {
        this.verifiedTitle = verifiedTitle;
        this.verifiedId = verifiedId;
    }
}


module.exports = {anime};