using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using ECommerce.Application.Auth;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private static readonly Regex PasswordPattern = new("^[A-Z]\\w{4,15}$", RegexOptions.Compiled);
    private static readonly Regex PhonePattern = new("^01[0125][0-9]{8}$", RegexOptions.Compiled);

    private readonly AppDbContext _db;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext db,
        IPasswordHasher<User> passwordHasher,
        IConfiguration configuration)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    [HttpPost("signup")]
    public async Task<ActionResult<AuthResponse>> SignUp(SignUpRequest request, CancellationToken cancellationToken)
    {
        var message = ValidateSignUp(request);
        if (message is not null)
        {
            return BadRequest(new { message });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var emailExists = await _db.Users.AnyAsync(user => user.Email == email, cancellationToken);
        if (emailExists)
        {
            return BadRequest(new { message = "Email already in use" });
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email,
            Phone = request.Phone.Trim()
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(CreateAuthResponse(user));
    }

    [HttpPost("signin")]
    public async Task<ActionResult<AuthResponse>> SignIn(SignInRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users
            .FirstOrDefaultAsync(item => item.Email == email, cancellationToken);

        if (user is null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "Incorrect email or password" });
        }

        return Ok(CreateAuthResponse(user));
    }

    private static string? ValidateSignUp(SignUpRequest request)
    {
        var name = request.Name?.Trim() ?? string.Empty;
        if (name.Length == 0)
        {
            return "Name is required";
        }

        if (name.Length < 3 || name.Length > 15)
        {
            return "Name must be between 3 and 15 characters";
        }

        if (string.IsNullOrWhiteSpace(request.Email) || !IsValidEmail(request.Email))
        {
            return "Invalid email format";
        }

        if (string.IsNullOrWhiteSpace(request.Password) || !PasswordPattern.IsMatch(request.Password))
        {
            return "Must start with uppercase and be 4-15 chars long";
        }

        if (request.Password != request.RePassword)
        {
            return "Passwords do not match";
        }

        if (string.IsNullOrWhiteSpace(request.Phone) || !PhonePattern.IsMatch(request.Phone.Trim()))
        {
            return "Invalid phone number";
        }

        return null;
    }

    private static bool IsValidEmail(string email)
    {
        var trimmed = email.Trim();
        try
        {
            var address = new MailAddress(trimmed);
            return address.Address == trimmed;
        }
        catch (FormatException)
        {
            return false;
        }
    }

    private AuthResponse CreateAuthResponse(User user)
    {
        return new AuthResponse
        {
            Token = CreateToken(user),
            User = new AuthUserResponse
            {
                Name = user.Name
            }
        };
    }

    private string CreateToken(User user)
    {
        var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing.");
        var issuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is missing.");
        var audience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience is missing.");
        var expiresInDays = _configuration.GetValue("Jwt:ExpiresInDays", 7);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new("id", user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Name, user.Name)
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddDays(expiresInDays),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
