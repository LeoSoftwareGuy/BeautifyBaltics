using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System.Reflection;

namespace BeautifyBaltics.ServiceDefaults.MvcConventions
{
    public class RoutePrefixConvention(
        Assembly? applicationAssembly,
        string groupName,
        string routePrefix
    ) : IControllerModelConvention
    {
        private readonly string _routePrefix = routePrefix.TrimEnd('/');

        public void Apply(ControllerModel controller)
        {
            if (controller.ControllerType.Assembly != applicationAssembly) return;

            controller.ApiExplorer.GroupName = groupName;

            foreach (var selector in controller.Selectors)
            {
                if (selector.AttributeRouteModel is null)
                {
                    selector.AttributeRouteModel = new AttributeRouteModel(
                        new RouteAttribute($"{_routePrefix}/[controller]")
                    );
                }
                else
                {
                    selector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(
                        new AttributeRouteModel(new RouteAttribute(_routePrefix)),
                        selector.AttributeRouteModel
                    );
                }
            }
        }
    }

}
