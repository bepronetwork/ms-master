
export function getAffiliatesReturn({affiliateLink, lostAmount}){
    const { parentAffiliatedLinks } = affiliateLink;
    
    /* Get indirect values for parent affiliate */ 
    let affiliateParentReturns = parentAffiliatedLinks.map( parentAffiliatedLink => {
        const { percentageOnLoss, isActive } = parentAffiliatedLink.affiliateStructure;

        if(!isActive){ return null }
        if(!percentageOnLoss || (percentageOnLoss <= 0) || percentageOnLoss >= 1){return null}
        return {
            amount                      : parseFloat(lostAmount*percentageOnLoss),
            parentAffiliateWalletId     : parentAffiliatedLink.affiliate.wallet._id
        }

    }).filter(el => el != null)

    /* Get Total Affiliate Return */
    const totalAffiliateReturn = affiliateParentReturns.reduce( (acc, a) =>  acc + a.amount ,0);

    return {
        totalAffiliateReturn : totalAffiliateReturn,
        affiliateReturns : affiliateParentReturns
    };
    
}
