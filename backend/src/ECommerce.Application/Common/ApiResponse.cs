namespace ECommerce.Application.Common;

public sealed class ApiResponse<T>
{
    public ApiResponse(T data)
    {
        Data = data;
    }

    public T Data { get; }
}
