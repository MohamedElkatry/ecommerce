namespace ECommerce.Application.Auth;

public sealed class AuthResponse
{
    public string Token { get; init; } = string.Empty;

    public AuthUserResponse User { get; init; } = new();
}

public sealed class AuthUserResponse
{
    public string Name { get; init; } = string.Empty;
}
