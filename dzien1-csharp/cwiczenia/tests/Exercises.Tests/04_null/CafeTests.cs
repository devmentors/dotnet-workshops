using Exercises.Null;
using Xunit;

namespace Exercises.Tests.Null;

public class CafeTests
{
    [Fact]
    public void OwnerLabel_returns_the_name_when_the_whole_chain_exists()
    {
        var order = new Order { Card = new LoyaltyCard { OwnerName = "Darek" } };

        Assert.Equal("Darek", Cafe.OwnerLabel(order));
    }

    [Fact]
    public void OwnerLabel_returns_the_fallback_when_any_link_is_null()
    {
        Assert.Equal("gość", Cafe.OwnerLabel(null));
        Assert.Equal("gość", Cafe.OwnerLabel(new Order()));
        Assert.Equal("gość", Cafe.OwnerLabel(new Order { Card = new LoyaltyCard() }));
    }

    [Fact]
    public void EnsureOwner_fills_a_missing_name_and_keeps_an_existing_one()
    {
        var blank = new LoyaltyCard();
        var named = new LoyaltyCard { OwnerName = "Darek" };

        Cafe.EnsureOwner(blank);
        Cafe.EnsureOwner(named);

        Assert.Equal("gość", blank.OwnerName);
        Assert.Equal("Darek", named.OwnerName);
    }

    [Fact]
    public void ClaimReward_resets_value_types_to_their_meaningful_defaults()
    {
        var card = new LoyaltyCard { OwnerName = "Darek", Stamps = 10, RewardReady = true };

        Cafe.ClaimReward(card);

        Assert.Equal(0, card.Stamps);
        Assert.False(card.RewardReady);
    }

    [Fact]
    public void ClaimReward_resets_the_reference_type_to_null()
    {
        var card = new LoyaltyCard { OwnerName = "Darek", Stamps = 10, RewardReady = true };

        Cafe.ClaimReward(card);

        Assert.Null(card.OwnerName);
    }
}
